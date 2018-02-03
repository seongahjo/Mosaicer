from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
import tensorflow as tf
import input
import core
FLAGS = tf.app.flags.FLAGS


def eval_once(saver, top_k_op, train_dir):
    result = {}
    with tf.Session() as sess:
        ckpt = tf.train.get_checkpoint_state(train_dir)
        if ckpt and ckpt.model_checkpoint_path:
            # Restores from checkpoint
            saver.restore(sess, ckpt.model_checkpoint_path)
            global_step = ckpt.model_checkpoint_path.split('/')[-1].split('-')[-1]
        else:
            print('No checkpoint file found')
            return

        # Start the queue runners.
        coord = tf.train.Coordinator()
        try:
            threads = []
            for qr in tf.get_collection(tf.GraphKeys.QUEUE_RUNNERS):
                threads.extend(qr.create_threads(sess, coord=coord, daemon=True,
                                                 start=True))

            values, indices = sess.run(top_k_op)
            # 최대 나올 갯
            for i in range(0, 10):
                result[indices.flatten().tolist()[i]] = values.flatten().tolist()[i]
        except Exception as e:  # pylint: disable=broad-except
            coord.request_stop(e)

        coord.request_stop()
        coord.join(threads, stop_grace_period_secs=10)
        return result


def evaluate(output, train_dir):
    with tf.Graph().as_default() as g:
        filename_queue = tf.train.string_input_producer([output])
        read_input = input.read_binary(filename_queue)
        reshaped_image = tf.cast(read_input.uint8image, tf.float32)
        # resized_image= tf.image.resize_image_with_crop_or_pad(reshaped_image,24,24)
        resized_image = tf.image.resize_images(reshaped_image, [FLAGS.input_size, FLAGS.input_size])
        float_image = tf.image.per_image_standardization(resized_image)

        float_image.set_shape([FLAGS.input_size, FLAGS.input_size, 3])
        read_input.label.set_shape([1])

        num_examples_per_epoch = FLAGS.num_examples
        min_queue_examples = int(num_examples_per_epoch)
        batch_size = FLAGS.batch_size

        images, labels = input._generate_image_and_label_batch(float_image, read_input.label, min_queue_examples,
                                                               batch_size, shuffle=False)
        # inference model.
        logits = core.inference(images)
        # Calculate predictions.
        top_k_op = tf.nn.top_k(tf.nn.softmax(logits), k=10)

        # Restore the moving average version of the learned variables for eval.
        variable_averages = tf.train.ExponentialMovingAverage(
            core.MOVING_AVERAGE_DECAY)
        variables_to_restore = variable_averages.variables_to_restore()
        saver = tf.train.Saver(variables_to_restore)

        return eval_once(saver, top_k_op, train_dir)
