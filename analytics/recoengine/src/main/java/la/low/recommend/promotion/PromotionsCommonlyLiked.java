package la.low.recommend.promotion;

import com.graphaware.reco.generic.transform.ParetoScoreTransformer;
import com.graphaware.reco.generic.transform.ScoreTransformer;
import com.graphaware.reco.neo4j.engine.SomethingInCommon;
import la.low.graph.Relationships;
import org.neo4j.graphdb.Direction;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.Relationship;
import org.neo4j.graphdb.RelationshipType;

import java.util.Collections;
import java.util.Map;

/****
 * Created by moshe on 12/24/15.
 *
 */
public class PromotionsCommonlyLiked extends SomethingInCommon {
    private ScoreTransformer scoreTransformer = new ParetoScoreTransformer(100, 10);

    @Override
    protected ScoreTransformer<Node> scoreTransformer() {
        return scoreTransformer;
    }

    @Override
    protected RelationshipType getType() {
        return Relationships.LIKE;
    }

    @Override
    protected Direction getDirection() {
        return Direction.BOTH;
    }

    @Override
    public String name() {
        return "FriendsLikePromotionInCommon";
    }

    @Override
    protected Map<String, Object> details(Node thingInCommon, Relationship withInput, Relationship withOutput) {
        return Collections.singletonMap("name", thingInCommon.getProperty("name"));
        //return super.details(thingInCommon, withInput, withOutput);
    }
}
