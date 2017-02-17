package la.low.recommend.promotion;

import com.graphaware.common.policy.BaseNodeInclusionPolicy;
import com.graphaware.reco.generic.context.Context;
import com.graphaware.reco.generic.policy.ParticipationPolicy;
import com.graphaware.reco.neo4j.engine.RandomRecommendations;
import org.neo4j.graphdb.DynamicLabel;
import org.neo4j.graphdb.Node;

/****
 * Created by moshe on 12/24/15.
 */
public class RandomPromotion extends RandomRecommendations {
    @Override
    public String name() {
        return "RANDOM_PROMOTION";
    }

    @Override
    protected com.graphaware.common.policy.NodeInclusionPolicy getPolicy() {
        return new BaseNodeInclusionPolicy() {
            @Override
            public boolean include(Node node) {
                return node.hasLabel(DynamicLabel.label("promotion"));
            }
        };
    }

    @Override
    public ParticipationPolicy<Node, Node> participationPolicy(Context context) {
        return ParticipationPolicy.IF_MORE_RESULTS_NEEDED_AND_ENOUGH_TIME;
    }

}
