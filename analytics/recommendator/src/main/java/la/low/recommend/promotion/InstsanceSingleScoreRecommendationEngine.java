package la.low.recommend.promotion;

import com.graphaware.reco.generic.context.Context;
import com.graphaware.reco.generic.engine.SingleScoreRecommendationEngine;

import java.util.Map;

/***
 * Created by moshe on 5/29/17.
 * discovers items a user may want to buy based on what other users with similar tastes have bought.
 */
public class InstsanceSingleScoreRecommendationEngine extends SingleScoreRecommendationEngine {
    protected Map doRecommendSingle(Object o, Context context) {
        return null;
    }

    public String name() {
        return null;
    }
}
