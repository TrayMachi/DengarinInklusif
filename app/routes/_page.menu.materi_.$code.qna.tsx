import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { MateriQNAModule } from '~/modules/MateriQNAModule';
import { MateriQNAAction } from '~/modules/MateriQNAModule/action';
import { MateriQNALoader } from '~/modules/MateriQNAModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return MateriQNALoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return MateriQNAAction(args);
}

export default function MateriQNAPage() {
  return <MateriQNAModule />;
}
