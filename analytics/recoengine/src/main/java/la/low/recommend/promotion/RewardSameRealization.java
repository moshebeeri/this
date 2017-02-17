package la.low.recommend.promotion;

import com.graphaware.reco.generic.result.PartialScore;
import com.graphaware.reco.neo4j.post.RewardSomethingShared;
import la.low.graph.Relationships;
import org.neo4j.graphdb.Direction;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.RelationshipType;

import java.util.Collections;

/****
 * Created by moshe on 1/26/16.
 */
public class RewardSameRealization extends RewardSomethingShared {

    @Override
    protected String name() {
        return "sameRealization";
    }

    @Override
    protected RelationshipType type() {
        return Relationships.REALIZED;
    }

    @Override
    protected Direction direction() {
        return Direction.BOTH;
    }

    @Override
    protected PartialScore partialScore(Node recommendation, Node input, Node sharedThing) {
        return new PartialScore(10, Collections.singletonMap("realized", sharedThing.getProperty("name")));
    }
}
