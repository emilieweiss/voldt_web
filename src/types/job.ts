export interface Job {
  id?: string;
  title: string;
  description: string;
  adress: string;
  duration: number;
  delivery: string; // 'HH:mm:ss'
  money: number; //how much money the job pays
  image_url?: string | null; // URL to the job image
}
