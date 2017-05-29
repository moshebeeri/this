package la.low.recommend.promotion;

import com.graphaware.reco.generic.engine.RecommendationEngine;
import com.graphaware.reco.generic.filter.BlacklistBuilder;
import com.graphaware.reco.generic.filter.Filter;
import com.graphaware.reco.generic.post.PostProcessor;
import com.graphaware.reco.neo4j.engine.Neo4jTopLevelDelegatingRecommendationEngine;
import org.neo4j.graphdb.Node;

import java.util.List;

/**
 * Created by moshe on 5/29/17.
 */
public class InstanceComputingEngine extends Neo4jTopLevelDelegatingRecommendationEngine {
    @Override
    protected List<RecommendationEngine<Node, Node>> engines() {
        return super.engines();
    }

    @Override
    protected List<PostProcessor<Node, Node>> postProcessors() {
        return super.postProcessors();
    }

    @Override
    protected List<BlacklistBuilder<Node, Node>> blacklistBuilders() {
        return super.blacklistBuilders();
    }

    @Override
    protected List<Filter<Node, Node>> filters() {
        return super.filters();
    }
}

/*
public class FriendsComputingEngine extends Neo4jTopLevelDelegatingRecommendationEngine {

    @Override
    protected List<RecommendationEngine<Node, Node>> engines() {
        return Arrays.<RecommendationEngine<Node, Node>>asList(
                new FriendsInCommon(),
                new RandomPeople()
        );
    }

    @Override
    protected List<PostProcessor<Node, Node>> postProcessors() {
        return Arrays.<PostProcessor<Node, Node>>asList(
                new RewardSameLabels(),
                new RewardSameLocation(),
                new PenalizeAgeDifference()
        );
    }

    @Override
    protected List<BlacklistBuilder<Node, Node>> blacklistBuilders() {
        return Arrays.<BlacklistBuilder<Node, Node>>asList(
                new ExistingRelationshipBlacklistBuilder(FRIEND_OF, BOTH)
        );
    }

    @Override
    protected List<Filter<Node, Node>> filters() {
        return Arrays.<Filter<Node, Node>>asList(
                new ExcludeSelf()
        );
    }
}
 */