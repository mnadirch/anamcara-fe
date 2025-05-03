import client from '../client';

export interface Blog {
    Id : number;
  Title: string;
  Description: string;
  AuthorName:string;
  MediaFile: File;
  MediaUrl: string;

}

export const getBlogbyId = (Id: number) => {
  return client.get<Blog>(`/blogs/${Id}`);
};


