package la.low.monad;

import java.util.function.Function;

/****
 * Created by moshe on 2/16/16.
 */
public interface Monad<V> {
    Monad<V> pure(V v);
    <R> Monad<R> bind(Function<V, Monad<R>> f);
    V get();
}
