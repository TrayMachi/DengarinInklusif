import {
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';
import { FlashcardModule } from '~/modules/FlashcardModule';
import { FlashcardAction } from '~/modules/FlashcardModule/action';
import { FlashcardLoader } from '~/modules/FlashcardModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return FlashcardLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return FlashcardAction(args);
}

export default function FlashcardPage() {
  return <FlashcardModule />;
}
