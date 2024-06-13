
import { Quote } from "../components/utils/Quote"
import { Auth } from "./utils/Auth"

export const Signin = () => {
  return <div>
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signin" />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  </div>
}
export default Signin
