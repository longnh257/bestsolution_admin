export default function auth({ next, router }: any) {
    if (!localStorage.getItem('access_token')) {
        return router.push('login');
    }
  
    return next();
}