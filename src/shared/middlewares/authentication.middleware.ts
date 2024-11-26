import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { RequestService } from "../request.service";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(private readonly requestService: RequestService) {}

    use(req: Request, res: Response, next: NextFunction) {
        next()    
    }
}