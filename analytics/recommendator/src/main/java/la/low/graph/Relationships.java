package la.low.graph;

import org.neo4j.graphdb.RelationshipType;

/****
 * Created by moshe on 12/24/15.
 */
public enum Relationships implements RelationshipType {
    LIKE,
    REALIZED,
    REWARDED,
}
