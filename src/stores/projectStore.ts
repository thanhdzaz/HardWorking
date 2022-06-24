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
}

export default ProjectStore;
