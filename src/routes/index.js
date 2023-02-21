import post from './post'
import main from './main'
import explore from './explore'

export default router => {
  post(router)
  explore(router)
  main(router)
}