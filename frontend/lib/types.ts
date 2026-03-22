export interface ScoringCriteria {
  experience_years?: number;
  skills?: string[];
  max_salary?: number;
}

export interface JobStats {
  total: number;
  pending: number;
  calling: number;
  completed: number;
  rescheduled: number;
  no_answer: number;
  advance: number;
}

export interface Job {
  id: string;
  title: string;
  jd: string;
  hr_phone: string;
  scoring_criteria: ScoringCriteria;
  status: 'created' | 'calling' | 'debriefing' | 'done';
  created_at: string;
  stats?: JobStats;
}

export interface Scores {
  communication: number;
  experience_fit: number;
  salary_expectation: number;
  availability: number;
  overall: number;
}

export interface TranscriptEntry {
  role: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  sequence: number;
}

export interface Call {
  id: string;
  candidate_id: string;
  job_id: string;
  clawdtalk_call_id?: string;
  status: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'rescheduled';
  transcript: TranscriptEntry[];
  scheduled_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  job_id: string;
  name: string;
  phone: string;
  email?: string;
  resume_text?: string;
  status: 'pending' | 'calling' | 'completed' | 'rescheduled' | 'no_answer';
  scores?: Scores;
  summary?: string;
  recommendation?: 'advance' | 'maybe' | 'reject';
  created_at: string;
  calls?: Call[];
}
