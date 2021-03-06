from setuptools import find_packages, setup


setup(
    version='0.17.1',
    name='incuna-surveys',
    packages=find_packages(exclude=('test_project', 'web')),
    include_package_data=True,
    install_requires=[
        'django-orderable>=4.0.5,<4.1',
        'django-parler>=1.7.0,<1.8',
    ],
    description=(
        'Allows the creation of custom questionnaires and surveys via the Django admin.'
    ),
    author='Incuna Ltd',
    author_email='admin@incuna.com',
    url='https://github.com/incuna/incuna-surveys',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Topic :: Software Development',
        'Topic :: Utilities',
    ],
)
