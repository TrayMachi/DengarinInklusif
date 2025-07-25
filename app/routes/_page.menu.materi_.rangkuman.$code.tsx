import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { MateriRangkumanModule } from '~/modules/MateriRangkumanModule';
import { MateriRangkumanAction } from '~/modules/MateriRangkumanModule/action';
import { MateriRangkumanLoader } from '~/modules/MateriRangkumanModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return MateriRangkumanLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return MateriRangkumanAction(args);
}

export default function MateriRangkumanPage() {
  return <MateriRangkumanModule />;
}
