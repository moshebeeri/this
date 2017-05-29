package la.low.recommend.promotion;

import com.graphaware.reco.generic.context.Context;
import com.graphaware.reco.generic.post.BasePostProcessor;
import com.graphaware.reco.generic.result.Recommendation;
import com.graphaware.reco.generic.result.Recommendations;
import com.graphaware.reco.generic.transform.ParetoFunction;
import com.graphaware.reco.generic.transform.TransformationFunction;
import org.neo4j.graphdb.Node;

/****
 * Created by moshe on 1/26/16.
 */
public class PenalizePriceDifference extends BasePostProcessor<Node, Node> {

    private final TransformationFunction function = new ParetoFunction(10, 20);

    @Override
    protected String name() {
        return "priceDifference";
    }

    @Override
    protected void doPostProcess(Recommendations<Node> recommendations, Node input, Context<Node, Node> context) {
        //  int age = getInt(input, "age", 40);
        float price = (Float)input.getProperty("price", input);

        for (Recommendation<Node> reco : recommendations.get()) {
            float reco_price = (Float)input.getProperty("price", reco.getItem());
            float diff = Math.abs( reco_price - price);
            reco.add(name(), -function.transform(diff));
        }
    }
}