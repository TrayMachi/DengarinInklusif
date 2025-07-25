import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { MateriDetailModule } from '~/modules/MateriDetailModule';
import { MateriDetailAction } from '~/modules/MateriDetailModule/action';
import { MateriDetailLoader } from '~/modules/MateriDetailModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return MateriDetailLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return MateriDetailAction(args);
}

export default function MateriDetailPage() {
  return <MateriDetailModule />;
}
