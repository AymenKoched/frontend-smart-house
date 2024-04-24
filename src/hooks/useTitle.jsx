import { useEffect } from "react";

const useTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        const newTitle = `${prevTitle.split(' | ')[0]} | ${title}`;
        document.title = newTitle;
        return () => {
            document.title = prevTitle;
        };
      }, [title]);
}

export default useTitle;