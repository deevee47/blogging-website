import { Appbar } from "../components/utils/Appbar";
import { FullBlog } from "../components/utils/FullBlog";
import { Spinner } from "../components/utils/sub/Spinner";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";

// atomFamilies/selectorFamilies
export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || ""
  });

  if (loading || !blog) {
    return <div>
      <Appbar />

      <div className="h-screen flex flex-col justify-center">

        <div className="flex justify-center">
          <Spinner />
        </div>
      </div>
    </div>
  }
  return <div>
    <FullBlog blog={blog} />
  </div>
}