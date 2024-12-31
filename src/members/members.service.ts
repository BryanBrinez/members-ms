import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaClient } from '@prisma/client';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MembersService extends PrismaClient implements OnModuleInit {


  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,

  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    console.log("base de datos coenctada")
  }



  async create(createMemberDto: CreateMemberDto) {

    try {
      const userExists = await firstValueFrom(
        this.client.send({ cmd: 'find_one_user' }, { id: createMemberDto.userId })
      );

      if (!userExists) {
        throw new RpcException('User not found');
      }

      const projectExists = await firstValueFrom(
        this.client.send({ cmd: 'find_one_project' }, createMemberDto.projectsId)
      );
      if (!projectExists) {
        throw new RpcException('Project not found');
      }

      const newMember = await this.member.create({
        data: createMemberDto,
      });
      return newMember;
    } catch (error) {
      throw new RpcException({ message: error.message, status: HttpStatus.BAD_REQUEST });
    }
  }


  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto

    const totalPages = await this.member.count()

    const lastPages = Math.ceil(totalPages / limit)


    return {
      data: await this.member.findMany({
        skip: (page - 1) * limit,
        take: limit
      }),
      metadata: {
        totalPages: totalPages,
        page: page,
        lastPages: lastPages
      }


    }
  }




  async findUsersNotInProject(projectId: string) {
    console.log('Searching for users not in project:', projectId);
  
    try {
      // Paso 1: Obtener todos los miembros del proyecto
      const members = await this.member.findMany({
        where: {
          projectsId: projectId
        },
        select: {
          userId: true // Solo seleccionamos los userId
        }
      });
  
      // Paso 2: Obtener todos los usuarios del microservicio de Users
      const allUsers = await firstValueFrom(
        this.client.send({ cmd: 'find_all_user' }, {})
      );
  
      // Paso 3: Filtrar los usuarios que NO están en el proyecto
      const usersNotInProject = allUsers.data.filter(user => 
        !members.some(member => member.userId === user.id)
      );
  
      return usersNotInProject;
    } catch (error) {
      console.error('Error while fetching users not in project:', error);
      throw new RpcException({
        message: 'Algo ha fallado, comunícate con tu administrador',
        status: HttpStatus.BAD_REQUEST
      });
    }
  }
  



  async findByProjectId(projectId: string) {
    console.log('Searching for projects with ownerId:', projectId, typeof projectId);


    try {
      const members = await this.member.findMany({
        where: {
          projectsId: projectId
        },
        distinct: ['userId']
      });

      if (members.length === 0) {
        return []
      }
      // // Construye un array de promesas para obtener cada projectExists
      // const membersPromises = members.map(async (element) => {
      //   return firstValueFrom(
      //     this.client.send({ cmd: 'find_one_user'  }, element.userId)
      //   );
      // });
  
      // // Espera a que todas las promesas se resuelvan
      // const newMembers = await Promise.all(membersPromises);



      // // Elimina duplicados basándote en una propiedad única (ej. 'id')
      // const uniqueMembers = newMembers.filter(
      //   (member, index, self) =>
      //     self.findIndex((m) => m.id === member.id) === index
      // );

      return members;

    } catch (error) {
      console.error('Error while fetching projects:', error);
      throw new RpcException({ message: 'Algo ha fallado, comunicate con tu administrador', status: HttpStatus.BAD_REQUEST });
    }
  }


  async findByUserId(userId: string) {
    console.log('Searching for projects with ownerId:', userId, typeof userId);
  
    try {
      const members = await this.member.findMany({
        where: {
          userId: userId
        }
      });
  
      if (members.length === 0) {
        return [];
      }
  
      // Construye un array de promesas para obtener cada projectExists
      const projectPromises = members.map(async (element) => {
        return firstValueFrom(
          this.client.send({ cmd: 'find_one_project' }, element.projectsId)
        );
      });
  
      // Espera a que todas las promesas se resuelvan
      const projects = await Promise.all(projectPromises);
  
      // Elimina duplicados basándote en una propiedad única (ej. 'id')
      const uniqueProjects = projects.filter(
        (project, index, self) =>
          self.findIndex((p) => p.id === project.id) === index
      );
  
      // Retorna el array de resultados únicos
      return uniqueProjects;
    } catch (error) {
      console.error('Error while fetching projects:', error);
      throw new RpcException({
        message: 'Algo ha fallado, comunícate con tu administrador',
        status: HttpStatus.BAD_REQUEST
      });
    }
  }
  



  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
