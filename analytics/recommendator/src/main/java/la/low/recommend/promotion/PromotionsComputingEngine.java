package la.low.recommend.promotion;

import com.graphaware.reco.generic.engine.RecommendationEngine;
import com.graphaware.reco.generic.filter.BlacklistBuilder;
import com.graphaware.reco.generic.filter.Filter;
import com.graphaware.reco.generic.post.PostProcessor;
import com.graphaware.reco.neo4j.engine.Neo4jTopLevelDelegatingRecommendationEngine;
import com.graphaware.reco.neo4j.filter.ExcludeSelf;
import com.graphaware.reco.neo4j.filter.ExistingRelationshipBlacklistBuilder;
import la.low.graph.Relationships;
import org.neo4j.graphdb.Direction;
import org.neo4j.graphdb.Node;
import java.util.Arrays;
import java.util.List;

/****
 * Created by moshe on 1/26/16.
 */
public class PromotionsComputingEngine extends Neo4jTopLevelDelegatingRecommendationEngine {

    @Override
    protected List<RecommendationEngine<Node, Node>> engines() {
        return Arrays.<RecommendationEngine<Node, Node>>asList(
                new PromotionsCommonlyLiked(),
                new RandomPromotion()
        );
    }

    @Override
    protected List<PostProcessor<Node, Node>> postProcessors() {
        return Arrays.<PostProcessor<Node, Node>>asList(
                //new RewardSameLabels(),
                new RewardSameRealization(),
                new PenalizePriceDifference()
        );
    }

    @Override
    protected List<BlacklistBuilder<Node, Node>> blacklistBuilders() {
        return Arrays.<BlacklistBuilder<Node, Node>>asList(
                new ExistingRelationshipBlacklistBuilder(Relationships.REWARDED, Direction.BOTH)
        );
    }

    @Override
    protected List<Filter<Node, Node>> filters() {
        return Arrays.<Filter<Node, Node>>asList(
                new ExcludeSelf()
        );
    }
}