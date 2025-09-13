export interface UserJob {
  id?: string;
  user_id: string; // ID of the user who has to do the job
  job_id: string; // ID of the job that the user has to do
  title: string;
  description: string;
  address: string;
  duration: number;
  delivery: string; // 'HH:mm:ss'
  image_solved_url?: string | null; // URL to the job image
  money: number; //how much money the job pays
  solved: boolean;
  approved: boolean;
  approved_time?: string // timestampz
}
