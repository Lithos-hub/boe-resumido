import { getMainPoints } from '~/server/services/openai/main-points';
import {
  genericErrorHandler,
  missingPropertiesHandler,
} from '~/validators/errorHandlers';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text } = missingPropertiesHandler(['text'], body);

    const mainPoints = await getMainPoints(text);

    return JSON.parse(mainPoints || '[]');
  } catch (error: unknown) {
    console.error('Error in boe/main-points:', error);
    genericErrorHandler(error);
  }
});
