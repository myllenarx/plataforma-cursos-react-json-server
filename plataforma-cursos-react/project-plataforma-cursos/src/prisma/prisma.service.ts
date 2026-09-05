import 'dotenv/config'
import { Injectable } from '@nestjs/common';
import {PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { connect } from 'http2';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) throw new Error('DATABASE_URL não definida');
        const adapter = new PrismaPg({connectionString: databaseUrl });
        super({ adapter });
    }
}
