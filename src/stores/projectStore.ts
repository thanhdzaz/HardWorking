import { firestore } from 'firebase';
import { getDocs, query, where } from 'firebase/firestore/lite';
import { action, makeObservable, observable } from 'mobx';
import { ProjectDto } from 'models/Task/dto';

class ProjectStore
{

    @observable listProject:ProjectDto[] = [];
    constructor()
    {
        makeObservable(this);
    }

  @action
  public setProject = async (project: ProjectDto[]): Promise<void> =>
  {
      this.listProject = project;
  };

  @action
  public getProject = async (id:string): Promise<void> =>
  {
      const q = query(firestore.collection('UsersProject'),where('userId', '==', id));
    
      const querySnapshot = await getDocs(q);
      const ids:string[] = [];
      const project:ProjectDto[] = [];
      querySnapshot.forEach((doc) =>
      {
          ids.push(doc.data().projectId);
      });
      if (ids.length > 0)
      {
          
          const userQuery = query(firestore.collection('project'),where('id', 'in', ids));
          const userQuerySnapshot = await getDocs(userQuery);

          userQuerySnapshot.forEach((doc) =>
          {
              // console.log(doc.id,'=>',doc.data());
              project.push(doc.data() as any);
          });
      
      }
      this.setProject(project);
  };
}

export default ProjectStore;
