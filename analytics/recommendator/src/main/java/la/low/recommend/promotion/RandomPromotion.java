package la.low.recommend.promotion;

import com.graphaware.common.policy.inclusion.NodeInclusionPolicy;
import com.graphaware.reco.neo4j.engine.RandomRecommendations;

/****
 * Created by moshe on 12/24/15.
 */
public class RandomPromotion extends RandomRecommendations {
    protected NodeInclusionPolicy getPolicy() {
        return null;
    }

    public String name() {
        return "RANDOM_PROMOTION";
    }
}
