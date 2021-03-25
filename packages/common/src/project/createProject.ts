import { Project } from './types';

export function getCreateProjectValue(
  projectId: string,
  inactivityTimeoutSeconds?: number
) {
  return {
    projectId: projectId.trim(),
    hooks: [],
    createdAt: new Date().toISOString(),
    inactivityTimeoutSeconds: inactivityTimeoutSeconds ?? 180,
  } as Project;
}
