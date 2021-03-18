import {
  AppError,
  INSTANCE_EXISTS,
  INSTANCE_RESULTS_UPDATE_FAILED,
  INSTANCE_SET_TESTS_FAILED,
  SCREENSHOT_URL_UPDATE_FAILED,
  VIDEO_URL_UPDATE_FAILED,
} from '@src/lib/errors';
import { getMongoDB } from '@src/lib/mongo';
import { getSanitizedMongoObject } from '@src/lib/results';
import { InstanceResult, SetInstanceTestsPayload } from '@src/types';

const COLLECTION_NAME = 'instances';

export const insertInstance = async ({
  runId,
  instanceId,
  spec,
  cypressVersion,
}: {
  runId: string;
  instanceId: string;
  spec: string;
  cypressVersion: string;
}) => {
  try {
    await getMongoDB().collection(COLLECTION_NAME).insertOne({
      spec,
      runId,
      instanceId,
      cypressVersion,
    });
  } catch (error) {
    if (error.code && error.code === 11000) {
      throw new AppError(INSTANCE_EXISTS);
    }
    throw error;
  }
};

export const getInstanceById = async (instanceId: string) =>
  await getMongoDB().collection(COLLECTION_NAME).findOne({ instanceId });

export const setInstanceResults = async (
  instanceId: string,
  results: InstanceResult | SetInstanceTestsPayload
) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        instanceId,
      },
      {
        $set: {
          results: getSanitizedMongoObject(results),
        },
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(INSTANCE_RESULTS_UPDATE_FAILED);
  }
};

export const setInstanceTests = async (
  instanceId: string,
  payload: SetInstanceTestsPayload
) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        instanceId,
      },
      {
        $set: {
          _createTestsPayload: getSanitizedMongoObject(payload),
        },
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(INSTANCE_SET_TESTS_FAILED);
  }
};

export const setScreenshotUrl = async (
  instanceId: string,
  screenshotId: string,
  screenshotURL: string
) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        instanceId,
      },
      {
        $set: {
          'results.screenshots.$[screenshot].screenshotURL': screenshotURL,
        },
      },
      {
        arrayFilters: [{ 'screenshot.screenshotId': screenshotId }],
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(SCREENSHOT_URL_UPDATE_FAILED);
  }
};

export const setvideoUrl = async (instanceId: string, videoUrl: string) => {
  const { matchedCount, modifiedCount } = await getMongoDB()
    .collection(COLLECTION_NAME)
    .updateOne(
      {
        instanceId,
      },
      {
        $set: {
          'results.videoUrl': videoUrl,
        },
      }
    );

  if (matchedCount && modifiedCount) {
    return;
  } else {
    throw new AppError(VIDEO_URL_UPDATE_FAILED);
  }
};
