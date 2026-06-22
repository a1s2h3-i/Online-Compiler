import { Request, Response } from "express";
import {  ProblemService } from "../services/problem.service";
import { ProblemRepository } from "../repositories/problem.repository";

// export interface IProblemController {
//     createProblem(req: Request, res: Response): Promise<void>;
//     getProblemById(req: Request, res: Response): Promise<void>;
//     getAllProblems(req: Request, res: Response): Promise<void>;
//     updateProblem(req: Request, res: Response): Promise<void>;
//     deleteProblem(req: Request, res: Response): Promise<void>;
//     findByDifficulty(req: Request, res: Response): Promise<void>;
//     searchProblems(req: Request, res: Response): Promise<void>;
// }
const problemRepository=new ProblemRepository();
const problemService=new ProblemService(problemRepository);

export const ProblemController = {
    // private ProblemService:IProblemService;

    // constructor(problemService:IProblemService){
    //     this.ProblemService=problemService;
    // }

    createProblem:async function (req: Request, res: Response):Promise<void>{
        

        const problem=await problemService.createProblem(req.body);

        res.status(201).json({
            message:"Problem created successfully",
            data:problem,
            success:true
        })
    },
    getProblemById:async function(req: Request, res: Response): Promise<void> {
        const id = req.params.id as string
        const problem = await problemService.getProblemById(id);

    res.status(200).json({
        message: "Problem fetched successfully",
        data: problem,
        success: true,
    });
    },
     updateProblem:async function(req: Request, res: Response): Promise<void> {
        const id = req.params.id as string
        const updatedProblem = await problemService.updateProblem(
            id,
            req.body
        );

        res.status(200).json({
            message: "Problem updated successfully",
            data: updatedProblem,
            success: true,
        });
    },

     deleteProblem:async function(req: Request, res: Response): Promise<void> {
        const id = req.params.id as string
        const deleted = await problemService.deleteProblem(
            id
        );

        res.status(200).json({
            message: "Problem deleted successfully",
            data: deleted,
            success: true,
        });
    },
     getAllProblems:async function(req: Request, res: Response): Promise<void> {
        const problems=await problemService.getAllProblems();
        res.status(200).json({
            message:"Problems fetched successfully",
            data:problems,
            success:true,
        })
    },
     findByDifficulty:async function(req: Request, res: Response): Promise<void> {
        const difficulty=req.params.diffculty as "easy"|"medium"|"hard";
        const problems=await problemService.findByDifficulty(difficulty);
        res.status(200).json({
            message:"Problems fetched successfully",
            data:problems,
            success:true
        })
    },
     searchProblems:async function(req: Request, res: Response): Promise<void> {
        const problems=await problemService.searchProblems(req.query.query as string);

        res.status(200).json({
            message:"Problems fetched successfully",
            data:problems,
            success:true
        })
    }

}