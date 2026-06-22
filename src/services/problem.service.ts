import { IProblem } from "../models/problem.model";
import { CreateProblemDto,UpdateProblemDto } from "../dtos/problem.dto";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitize, sanitizeMarkdown } from "../utils/markdown.sanitizer";
export interface IProblemService{
    createProblem(problem:CreateProblemDto):Promise<IProblem>
    getProblemById(id:string):Promise<IProblem|null>;
    getAllProblems():Promise<{problems:IProblem[],total:number}>;
    updateProblem(id:String,updateData:UpdateProblemDto):Promise<IProblem|null>;
    deleteProblem(id:String):Promise<boolean>;
    findByDifficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]>;
    searchProblems(query:string):Promise<IProblem[]>

}

export class ProblemService implements IProblemService{
    private problemRepository:IProblemRepository;

    constructor(problemRepository:IProblemRepository){
        this.problemRepository=problemRepository
    }

    async createProblem(problem: CreateProblemDto): Promise<IProblem> {
        const sanitizePayload={
            ...problem,description:await sanitizeMarkdown(problem.description),
            editorial:problem.editorial&&await sanitizeMarkdown(problem.editorial)
        }
        return await this.problemRepository.createProblem(sanitizePayload);
    }
    async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
        return await this.problemRepository.getAllProblems();
    }
    async getProblemById(id: string): Promise<IProblem | null> {
        const problem=await this.problemRepository.getProblemById(id);

        if(!problem){
            throw new NotFoundError("Problem not found");
        }
        return problem;
    }
    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
        const problem=await this.problemRepository.getProblemById(id);

        if(!problem){
            throw new NotFoundError("Problem not found");
        }
        const sanitizePayload:Partial<IProblem>={
            ...updateData
        }
        if(updateData.description){
            sanitizePayload.description=await sanitizeMarkdown(updateData.description);
        }
        if(updateData.editorial){
            sanitizePayload.editorial=await sanitizeMarkdown(updateData.editorial);
        }
        return await this.problemRepository.updateProblem(id,sanitizePayload);
    }

    async deleteProblem(id: String): Promise<boolean> {
        const result=await this.problemRepository.deleteProblem(id);
        if(!result){
            throw new NotFoundError("Problem not found");
        }
        return result;
    }

    async findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]> {
        return await this.problemRepository.findByDifficulty(difficulty);
    }
    async searchProblems(query: string): Promise<IProblem[]> {
        if(!query||query.trim()===""){
            throw new BadRequestError("Query is required");
        }
        return await this.problemRepository.searchProblems(query);
    }

}