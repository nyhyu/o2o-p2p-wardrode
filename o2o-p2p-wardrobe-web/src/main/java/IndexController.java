import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.*;

/**
 * Created by niuyueheng on 2017/1/9.
 *
 */
@Controller
@RequestMapping("/main")
public class IndexController {
    private String vmRootPath = "biz-index/";

    @RequestMapping(value = "index", method = RequestMethod.GET)
    public String index(HttpServletRequest request,	HttpServletResponse response, ModelMap model, String orderNo) {
        String result = vmRootPath.concat("index");
        return result;
    }
}
