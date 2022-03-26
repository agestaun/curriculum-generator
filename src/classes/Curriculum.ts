import {Job} from './Job'
import {Candidate} from './Candidate'

export class Curriculum {
  candidate: Candidate
  jobs: Array<Job>

  constructor(jsonStr: string) {
    const parsed = JSON.parse(jsonStr)
    this.candidate = parsed.candidate
    this.jobs = parsed.jobs
  }
}
