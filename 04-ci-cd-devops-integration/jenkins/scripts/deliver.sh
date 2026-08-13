#!/usr/bin/env bash
#
# Deliver stage for the Rest Assured suite. Adapted from the Jenkins tutorial
# "Build a Java app with Maven".
#
# The tutorial's sample app is executable and ends with `java -jar`. This
# project is a test suite: src/main/java holds request/response POJOs only and
# the jar has no Main-Class, so running it would fail with "no main manifest
# attribute". Instead we install the artifact into the local Maven repository
# and verify it landed, which is the meaningful delivery step for a library.
#
# Run from the Maven project directory (the Jenkinsfile does this via dir()).

set -euo pipefail

echo 'Packaging and installing the artifact into the local Maven repository,'
echo 'which is persisted in the Jenkins agent between builds.'
set -x
mvn -B jar:jar install:install
set +x

echo 'Reading the <name/> and <version/> elements from pom.xml.'
set -x
NAME=$(mvn -q -B -DforceStdout help:evaluate -Dexpression=project.name)
VERSION=$(mvn -q -B -DforceStdout help:evaluate -Dexpression=project.version)
set +x

ARTIFACT="target/${NAME}-${VERSION}.jar"

echo "Verifying the built artifact: ${ARTIFACT}"
set -x
ls -lh "${ARTIFACT}"
unzip -l "${ARTIFACT}"
set +x

echo "Delivered ${NAME} ${VERSION}."
