package la.low.recommend.promotion;

import com.graphaware.common.policy.inclusion.BaseNodeInclusionPolicy;
import com.graphaware.common.policy.inclusion.NodeInclusionPolicy;
import com.graphaware.reco.generic.context.Context;
import com.graphaware.reco.generic.policy.ParticipationPolicy;
import com.graphaware.reco.neo4j.engine.RandomRecommendations;
import org.neo4j.graphdb.DynamicLabel;
import org.neo4j.graphdb.Node;

/****
 * Created by moshe on 12/24/15.
 */
public class RandomPromotion extends RandomRecommendations {
    public String name() {
        return "random";
    }

    @Override
    protected NodeInclusionPolicy getPolicy() {
        return new BaseNodeInclusionPolicy() {
            public boolean include(Node node) {
                return node.hasLabel(DynamicLabel.label("Person"));
            }
        };
    }

//    @Override
//    public ParticipationPolicy<Node, Node> participationPolicy(Context<Node, Node> context) {
//        return ParticipationPolicy.IF_MORE_RESULTS_NEEDED_AND_ENOUGH_TIME;
//    }
}
