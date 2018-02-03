from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import time
from datetime import datetime

import tensorflow as tf
import core

FLAGS = tf.app.flags.FLAGS


def train_data(data_dir, train_dir,steps=FLAGS.max_steps):
    with tf.Graph().as_default():
        global_step = tf.contrib.framework.get_or_create_global_step()

        images, labels = core.distorted_inputs(data_dir=data_dir)
        # Build a Graph that computes the logits predictions from the
        # inference model.
        logits = core.inference(images)
        # Calculate loss.
        loss = core.loss(logits, labels)

        # Build a Graph that trains the model with one batch of examples and
        # updates the model parameters.
        train_op = core.train(loss, global_step)

        class _LoggerHook(tf.train.SessionRunHook):
            """Logs loss and runtime."""

            def begin(self):
                self._step = -1

            def before_run(self, run_context):
                self._step += 1
                self._start_time = time.time()
                return tf.train.SessionRunArgs(loss)  # Asks for loss value.

            def after_run(self, run_context, run_values):
                duration = time.time() - self._start_time
                loss_value = run_values.results
                if self._step % 10 == 0:
                    num_examples_per_step = FLAGS.batch_size
                    examples_per_sec = num_examples_per_step / duration
                    sec_per_batch = float(duration)

                    format_str = ('%s: step %d, loss = %.2f (%.1f examples/sec; %.3f '
                                  'sec/batch)')
                    print(format_str % (datetime.now(), self._step, loss_value,
                                        examples_per_sec, sec_per_batch))
        with tf.train.MonitoredTrainingSession(
                checkpoint_dir=train_dir,
                hooks=[tf.train.StopAtStepHook(last_step=steps),
                       tf.train.NanTensorHook(loss),
                       _LoggerHook()],
                config=tf.ConfigProto(
                    log_device_placement=FLAGS.log_device_placement)) as mon_sess:
            while not mon_sess.should_stop():
                mon_sess.run(train_op)
            if mon_sess.should_stop():
                return True


def main(argv=None):  # pylint: disable=unused-argument
    # core.maybe_download_and_extract()
    if tf.gfile.Exists(FLAGS.train_dir):
        tf.gfile.DeleteRecursively(FLAGS.train_dir)
    tf.gfile.MakeDirs(FLAGS.train_dir)
    train_data(data_dir=FLAGS.data_dir, train_dir=FLAGS.train_dir, steps=10)


if __name__ == '__main__':
    tf.app.run()
