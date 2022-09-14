import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BpiSubjectDto } from "../../api/dtos/response/bpiSubject.dto";
import { BpiSubjectRepository } from "../../persistence/bpiSubjects.repository";
import { GetAllBpiSubjectsQuery } from "./getAllBpiSubjects.query";

@QueryHandler(GetAllBpiSubjectsQuery)
export class GetAllBpiSubjectsQueryHandler implements IQueryHandler<GetAllBpiSubjectsQuery> {
  constructor(
    private readonly repo: BpiSubjectRepository,
  ) {}

  async execute(query: GetAllBpiSubjectsQuery) {
    const bpiSubjects = await this.repo.getAllBpiSubjects();

    return bpiSubjects.map(bp => {
      return  {
        id: bp.id,
        name: bp.name,
        desc: bp.description,
        publicKey: bp.publicKey
      } as BpiSubjectDto
    })
  }
}