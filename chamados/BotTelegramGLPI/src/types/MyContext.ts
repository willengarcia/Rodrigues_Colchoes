import { Scenes } from 'telegraf';

export interface MySessionData {
  categoryId?: number;
  subcategoryId?: number;
  userName?: string;
  idUser?: string;
  idSentMessage?: number;
  idItem?:number
}

// Ajuste a interface MyContext para herdar do SceneContext corretamente
export interface MyContext extends Scenes.SceneContext {
  session: MySessionData & Scenes.SceneSession;
  match?: RegExpMatchArray;
}