import { execSync } from 'child_process';
import path from 'node:path';

const commits = execSync('git log --pretty=format:"%H|%s" --name-only -10').toString();
console.log(commits)