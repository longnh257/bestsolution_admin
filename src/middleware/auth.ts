export default function auth({ next, router }: any) {
    if (!localStorage.getItem('access_token')) {
        return router.push({ name:'login', query: { err: 1 } })
    }
  
    return next();
}