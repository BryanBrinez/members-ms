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
