import { execSync } from 'child_process';
import path from 'node:path';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';

type FrontMatter = {
    title: string
    data: Date
    description: string
    tags: string[]
    authors: string[],
    path: string
}

const log = execSync('git log --pretty=format:"%H|%s" --name-only -1 -- "*.md"').toString();

const paths: string[] = log
    .split('\n')
    .map((line: string) => !line.includes('|') && line.trim() ? line.trim() : undefined)
    .filter((line: string | undefined): line is string => line !== undefined);
const files: FrontMatter[] = paths.map((filePath: string) => ({
    ...matter(readFileSync(filePath, 'utf-8')).data,
    path: path.parse(filePath).dir + '/' + path.parse(filePath).name
}) as FrontMatter);
console.log(JSON.stringify(files));