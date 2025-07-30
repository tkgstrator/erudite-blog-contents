import { execSync } from 'child_process';
import path from 'node:path';

type GitLogEntry = {
    hash: string
    message: string
    files: string[]
}

const log = execSync('git log --pretty=format:"%H|%s" --name-only -10 -- "*.md"').toString();

console.log(log)