import { redirect } from 'react-router-dom';

export function action() {
  localStorage.removeItem('adUser');
  localStorage.removeItem('token');
  return redirect('/');
}
