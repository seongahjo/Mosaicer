import tensorflow as tf

# basic
tf.app.flags.DEFINE_integer('image_size', 32, """image size""")

# compare
tf.app.flags.DEFINE_integer('num_examples', 1,
                            """Number of examples to run.""")
tf.app.flags.DEFINE_integer('input_size', 24, """INPUT SIZE""")
tf.app.flags.DEFINE_integer('label_size', 10, """Label size""")

# core
# Basic model parameters.
# 128
tf.app.flags.DEFINE_integer('batch_size', 512,
                            """Number of images to process in a batch.""")

tf.app.flags.DEFINE_boolean('use_fp16', False,
                            """Train the model using fp16.""")

# input
tf.app.flags.DEFINE_integer('num_classes', 10,
                            """Number of classes to run.""")
tf.app.flags.DEFINE_integer('num_image', 70,
                            """Number of images to run.""")

# train
tf.app.flags.DEFINE_integer('max_steps', 500,
                            """Number of batches to run.""")
tf.app.flags.DEFINE_boolean('log_device_placement', False,
                            """Whether to log device placement.""")
tf.app.flags.DEFINE_integer('threshold', 0.7,
                            """minimum value to identify image.""")
tf.app.flags.DEFINE_integer('num_gpus', 1,
                            """Number of gpu""")
# mosaic
tf.app.flags.DEFINE_integer('target_label', 9,
                            """label you do not want to digitize""")
tf.app.flags.DEFINE_integer('face_frame', 10,
                            """save face per defined frame""")
tf.app.flags.DEFINE_integer('skip_frame', 3, """skiep face per defined frame""")
tf.app.flags.DEFINE_string('extension', '.jpg', """file extension of extracted face""")


# directory
tf.app.flags.DEFINE_string('image_dir', 'image',
                           """Path to the image data directory.""")
tf.app.flags.DEFINE_string('data_dir', 'data',
                           """Path to the binary data directory.""")
tf.app.flags.DEFINE_string('video_dir', 'video',
                           """Path to the video data directory.""")
tf.app.flags.DEFINE_string('train_dir', '/tmp/seongah_train',
                           """Path to the train data directory.""")
tf.app.flags.DEFINE_string('temp_dir', '/tmp/seongah_temp',
                           """Path to the temp data directory.""")
