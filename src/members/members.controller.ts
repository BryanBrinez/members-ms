import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @MessagePattern({ cmd: 'create_member' })
  create(@Payload() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @MessagePattern({ cmd: 'find_all_members' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.membersService.findAll(paginationDto);

  }

  @MessagePattern('findOneMember')
  findOne(@Payload() id: number) {
    return this.membersService.findOne(id);
  }

  @MessagePattern({ cmd: 'find_by_projec_id' })
  findByProjectId(@Payload() projectId: string) {
    return this.membersService.findByProjectId(projectId);
  }


  @MessagePattern({ cmd: 'find_users_not_in_project' })
  findUsersNotInProject(@Payload() projectId: string) {
    return this.membersService.findUsersNotInProject(projectId);
  }


  @MessagePattern({ cmd: 'find_by_user_id' })
  findByUserId(@Payload() userId: string) {
    return this.membersService.findByUserId(userId);
  }

  // @MessagePattern('updateMember')
  // update(@Payload() updateMemberDto: UpdateMemberDto) {
  //   return this.membersService.update(updateMemberDto.id, updateMemberDto);
  // }

  @MessagePattern('removeMember')
  remove(@Payload() id: number) {
    return this.membersService.remove(id);
  }
}
