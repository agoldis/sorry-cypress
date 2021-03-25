import { init } from '@src/lib/mongo';
import { ExecutionDriver } from '@src/types';
import * as mongoInstanceController from './instances/instance.controller';
import * as mongoInstanceModel from './instances/instance.model';
import * as mongoProjectModel from './projects/project.model';
import * as mongoRunController from './runs/run.controller';
import * as mongoRunModel from './runs/run.model';

export const driver: ExecutionDriver = {
  id: 'stateful-mongo',
  init,
  getProjectById: mongoProjectModel.getProjectById,
  getRunById: mongoRunModel.getRunById,
  getRunWithSpecs: mongoRunModel.getRunWithSpecs,
  getInstanceById: mongoInstanceModel.getInstanceById,
  createRun: mongoRunController.createRun,
  getNextTask: mongoRunController.getNextTask,
  setVideoUrl: mongoInstanceController.setVideoUrl,
  setScreenshotUrl: mongoInstanceController.setScreenshotUrl,
  setInstanceResults: mongoInstanceController.setInstanceResults,
  setRunCompleted: mongoRunModel.setRunCompleted,
  setRunCompletedWithTimeout: mongoRunModel.setRunCompletedWithTimeout,
  setInstanceTests: mongoInstanceController.setInstanceTests,
  updateInstanceResults: mongoInstanceController.updateInstanceResults,
};
