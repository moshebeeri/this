package la.low.monad;

import java.util.concurrent.Future;
import java.util.function.Function;

/****
 * Created by moshe on 2/16/16.
 */
public class Promise<V> implements Monad<V>{
    @Override
    public Promise<V> pure(V v) {
        Promise<V> p = new Promise<V>();
        //p.invoke(v);
        return p;
    }

    @Override
    public <R> Monad<R> bind(Function<V, Monad<R>> f) {
        Promise<R> result = new Promise<>();
//        this.onRedeem(callback -> {
//            V v = callback.get();
//            Promise<R> appRes = function.apply(v);
//            appRes.onRedeem(c -> {
//                R r = c.get();
//                result.invoke(r);
//            });
//        });
        return result;
    }

    @Override
    public V get() {
        return null;
    }

    private Promise<Boolean> r;
    Function<Integer, Promise<Boolean>> function = (x) -> {
      return r;
    };

//    public <R> Promise<R> bind(Function<V, Promise<R>> function) {
//        Promise<R> result = new Promise<>();
//        return result;
//    }

//    private void invoke(V v){}
//    private void invokeWithException(Throwable throwable){}
//    private void onRedeem(Action<Promise<V>> callback){}

}
