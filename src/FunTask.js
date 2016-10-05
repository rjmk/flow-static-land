// @flow

import { HKT } from './HKT'
import type { HKT2 } from './HKT'
import type { Monad } from './Monad'
import type { Bifunctor } from './Bifunctor'
import type { Monoid } from './Monoid'

import * as arr from './Arr'

import Task from 'fun-task'

class IsTask {}

export type FunTask<+F, +S> = HKT2<IsTask, F, S>

export function inj<S, F>(a: Task<S, F>): FunTask<F, S> {
	return ((a: any): FunTask<F, S>)
}

export function prj<S, F>(fa: FunTask<F, S>): Task<S, F> {
	return ((fa: any): Task<S, F>)
}

export function map<S, T, F>(f: (s: S) => T, ts: FunTask<F, S>): FunTask<F, T> {
	return inj(Task.map(f, prj(ts)))
}

export function bimap<F, S, G, T>(f: (f: F) => G, g: (s: S) => T, tfs: FunTask<F, S>): FunTask<G, T> {
	return inj(Task.bimap(f, g, prj(tfs)))
}

export function ap<S, T, F>(tst: FunTask<F, (s: S) => T>, ts: FunTask<F, S>): FunTask<F, T> {
	return inj(Task.ap(prj(tst), prj(ts)))
}

export function of<S>(s: S): FunTask<*, S> {
	return inj(Task.of(s))
}

export function chain<S, T>(f: (s: S) => FunTask<*, T>, ts: FunTask<*, S>): FunTask<*, T> {
	return inj(Task.chain(x => prj(f(x)), prj(ts)))
}

export function empty<A>(m: Monoid<A>): () => FunTask<*, A> {
	return () => of(m.empty())
}

export function concat<A>(ta: FunTask<*, A>, tb: FunTask<*, A>): FunTask<*, A> {
	return inj(Task.concat(prj(ta), prj(tb)))
}

({ map, ap, of, chain, bimap }: Monad<HKT<IsTask, *>> & Bifunctor<IsTask>);

<A>(m: Monoid<A>) => ({ empty: empty(m), concat }: Monoid<FunTask<*, A>>)
