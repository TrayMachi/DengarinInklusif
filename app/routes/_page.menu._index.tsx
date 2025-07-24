import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';
import { MenuIndexModule } from '~/modules/MenuIndexModule';
import { MenuIndexAction } from '~/modules/MenuIndexModule/action';
import { MenuIndexLoader } from '~/modules/MenuIndexModule/loader';

export async function loader(args: LoaderFunctionArgs) {
  return MenuIndexLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  return MenuIndexAction(args);
}

export default function MenuIndexPage() {
  return <MenuIndexModule />;
}
